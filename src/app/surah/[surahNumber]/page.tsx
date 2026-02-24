import SurahDetail from '../../../components/SurahDetail'

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ surahNumber: String(i + 1) }))
}

export default function SurahPage() {
  return <SurahDetail />
}
