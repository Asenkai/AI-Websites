import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

const DEFAULT_TITLE = 'Aadiv Care Foundation';
const DEFAULT_DESCRIPTION = 'Healing, Hope & Dignity — Together. Your support transforms lives.';
// NOTE: Replace with your actual domain and a real default social media image
const SITE_URL = 'https://mknblhhdbbpleejkmfkx.supabase.co'; 
const DEFAULT_IMAGE_URL = `${SITE_URL}/placeholder.svg`;

export const MetaTags = ({ title, description, imageUrl }: MetaTagsProps) => {
  const location = useLocation();
  const pageUrl = `${SITE_URL}${location.pathname}`;

  const pageTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageImageUrl = imageUrl || DEFAULT_IMAGE_URL;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImageUrl} />
    </Helmet>
  );
};