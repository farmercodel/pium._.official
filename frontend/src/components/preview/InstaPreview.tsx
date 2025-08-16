import { InstagramEmbed } from 'react-social-media-embed';

interface InstaPreviewProps {
    POST_ID: string
}

function InstaPreview({ POST_ID }: InstaPreviewProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <InstagramEmbed 
        url={`https://www.instagram.com/p/${POST_ID}/`} 
        width={328} 
      />
    </div>
  );
}

export default InstaPreview