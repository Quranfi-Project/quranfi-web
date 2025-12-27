// src/components/PrivacyPolicy.tsx
const PrivacyPolicy = () => {
    return (
      <div className="max-w-4xl mx-auto p-6 prose prose-blue">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for Quranify</h1>
        
        <p className="text-gray-600 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
  
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Data Collection</h2>
            <p>
              <strong>We collect nothing!</strong>
            </p>
          </section>         
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Policy Updates</h2>
            <p>
              Changes will be posted here. Continued use constitutes acceptance.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Contact</h2>
            <p>
              For privacy concerns: <a href="mailto:privacy@quranify.xyz" className="text-blue-600">privacy@quranify.xyz</a>
            </p>
          </section>
        </div>
      </div>
    );
  };
  
  export default PrivacyPolicy;