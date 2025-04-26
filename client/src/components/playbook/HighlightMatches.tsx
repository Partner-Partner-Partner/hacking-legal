export interface HighlightMatchesProps {
  text: string;
  query: string;
  maxLength?: number;
}

export function HighlightMatches({ text, query, maxLength = 150 }: HighlightMatchesProps) {
  if (!query || !text) return <span>{text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text}</span>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  let trimmedText = text;
  const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
  if (matchIndex > -1 && text.length > maxLength) {
    const start = Math.max(0, matchIndex - Math.floor(maxLength / 2));
    const end = Math.min(text.length, start + maxLength);
    trimmedText = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
  } else if (text.length > maxLength) {
    trimmedText = text.slice(0, maxLength) + '...';
  }
  
  const trimmedParts = trimmedText.split(regex);
  
  return (
    <span>
      {trimmedParts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 border-b border-yellow-400">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
