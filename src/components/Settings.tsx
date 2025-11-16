// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import supabase from '../utils/supbase';
// import { FaUser, FaEnvelope, FaImage, FaBookmark, FaUserEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import supabase_admin from '../utils/subabaseadmin';

// export default function Settings() {
//   const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks'>('profile');
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('No user logged in');
      
//       setUser(user);

//       const { data: profileData, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;
//       setProfile(profileData);
//       setAvatarUrl(profileData?.avatar_url || null);
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
    
//     const file = e.target.files[0];
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${user.id}${Math.random()}.${fileExt}`;
//     const filePath = `avatars/${fileName}`;

//     setUploading(true);
//     try {
//       // Delete old avatar if exists
//       if (avatarUrl) {
//         const oldFileName = avatarUrl.split('/').pop();
//         await supabase.storage.from('avatars').remove([`avatars/${oldFileName}`]);
//       }

//       // Upload new image
//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(filePath);

//       // Update profile
//       const { error: updateError } = await supabase
//         .from('profiles')
//         .update({ avatar_url: publicUrl })
//         .eq('id', user.id);

//       if (updateError) throw updateError;

//       setAvatarUrl(publicUrl);
//       toast.success('Avatar updated successfully!');
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           username: profile.username,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', user.id);

//       if (error) throw error;

//       toast.success('Profile updated successfully!');
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//       setShowConfirmDelete(false);


//     try {
//       setLoading(true);
//       toast.info('Deleting your account...');

//       // 1. Delete user's avatar if exists
//       if (avatarUrl) {
//         const fileName = avatarUrl.split('/').pop();
//         await supabase.storage.from('avatars').remove([`avatars/${fileName}`]);
//       }

//       // 2. Delete user's profile
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .delete()
//         .eq('id', user.id);

//       if (profileError) throw profileError;

//       // 3. Delete auth user (requires service role)
//       const { error: authError } = await supabase_admin.auth.admin.deleteUser(user.id);
//       if (authError) throw authError;

//       // 4. Sign out
//       await supabase.auth.signOut();
      
//       toast.success('Account deleted successfully');
//       navigate('/');
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to delete account');
//       console.error('Delete account error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
//         </div>
//         <nav className="p-4">
//           <button
//             onClick={() => setActiveTab('profile')}
//             className={`flex items-center w-full p-3 rounded-lg mb-2 ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
//           >
//             <FaUserEdit className="mr-3" />
//             Profile Settings
//           </button>
//           <button
//             onClick={() => setActiveTab('bookmarks')}
//             className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'bookmarks' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
//           >
//             <FaBookmark className="mr-3" />
//             Bookmark Settings
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8 overflow-auto">
//         {activeTab === 'profile' ? (
//           <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
//             <h2 className="text-2xl font-bold mb-6 flex items-center">
//               <FaUserEdit className="mr-2" />
//               Profile Settings
//             </h2>
            
//             <div className="flex flex-col md:flex-row gap-8">
//               {/* Avatar Section */}
//               <div className="flex flex-col items-center">
//                 <div className="relative mb-4">
//                   {avatarUrl ? (
//                     <img
//                       src={avatarUrl}
//                       alt="Profile"
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
//                       {user?.email?.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                   <label 
//                     htmlFor="avatar-upload"
//                     className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
//                     title="Change avatar"
//                   >
//                     <FaImage className="text-indigo-600" />
//                     <input
//                       id="avatar-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleAvatarUpload}
//                       className="hidden"
//                       disabled={uploading}
//                     />
//                   </label>
//                 </div>
//                 {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
//               </div>

//               {/* Profile Form */}
//               <div className="flex-1">
//                 <form onSubmit={handleProfileUpdate}>
//                   <div className="mb-4">
//                     <div className="flex items-center text-gray-700 mb-2">
//                       <FaUser className="mr-2" />
//                       <label htmlFor="username">Username</label>
//                     </div>
//                     <input
//                       id="username"
//                       type="text"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       value={profile?.username || ''}
//                       onChange={(e) => setProfile({...profile, username: e.target.value})}
//                       required
//                     />
//                   </div>

//                   <div className="mb-4">
//                     <div className="flex items-center text-gray-700 mb-2">
//                       <FaEnvelope className="mr-2" />
//                       <label htmlFor="email">Email</label>
//                     </div>
//                     <input
//                       id="email"
//                       type="email"
//                       className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                       value={user?.email || ''}
//                       disabled
//                     />
//                     <p className="text-sm text-gray-500 mt-1">Email can't be changed here</p>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//                   >
//                     {loading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 </form>

//                 {/* Danger Zone */}
//                 <div className="mt-12 pt-6 border-t border-gray-200">
//                   <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
//                   <div className="bg-red-50 p-4 rounded-lg">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                       <div>
//                         <h4 className="font-medium text-red-700">Delete Account</h4>
//                         <p className="text-sm text-red-600">
//                           Permanently remove your account and all associated data
//                         </p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmDelete(true)}
//                         disabled={loading}
//                         className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
//                       >
//                         <FaTrash className="mr-2" />
//                         Delete Account
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
//             <h2 className="text-2xl font-bold mb-6 flex items-center">
//               <FaBookmark className="mr-2" />
//               Bookmark Settings
//             </h2>
//             <div className="space-y-4">
//               <div className="p-4 border border-gray-200 rounded-lg">
//                 <h3 className="font-medium text-lg mb-2">Export Bookmarks</h3>
//                 <p className="text-gray-600 mb-3">Download all your bookmarks as a JSON file</p>
//                 <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800">
//                   Export Bookmarks
//                 </button>
//               </div>
//               <div className="p-4 border border-gray-200 rounded-lg">
//                 <h3 className="font-medium text-lg mb-2">Import Bookmarks</h3>
//                 <p className="text-gray-600 mb-3">Upload a JSON file to import bookmarks</p>
//                 <input
//                   type="file"
//                   accept=".json"
//                   className="block w-full text-sm text-gray-500
//                     file:mr-4 file:py-2 file:px-4
//                     file:rounded-lg file:border-0
//                     file:text-sm file:font-semibold
//                     file:bg-indigo-50 file:text-indigo-700
//                     hover:file:bg-indigo-100"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {showConfirmDelete && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
//     <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">
//         Confirm Account Deletion
//       </h3>
//       <p className="text-gray-600 mb-4">
//         Are you sure you want to permanently delete your account? This action cannot be undone.
//       </p>
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setShowConfirmDelete(false)}
//           className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleDeleteAccount}
//           className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//           disabled={loading}
//         >
//           {loading ? 'Deleting...' : 'Delete'}
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }