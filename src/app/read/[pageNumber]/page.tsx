import ReadingMode from '../../../components/ReadingMode';

export function generateStaticParams() {
  return Array.from({ length: 604 }, (_, i) => ({ pageNumber: String(i + 1) }))
}

export default function ReadPageNumber() {
  return <ReadingMode />;
}
