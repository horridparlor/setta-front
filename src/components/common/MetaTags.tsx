import React, { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
}) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.setAttribute('name', 'description');
      newMetaDescription.setAttribute('content', description);
      document.getElementsByTagName('head')[0].appendChild(newMetaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.setAttribute('name', 'keywords');
      newMetaKeywords.setAttribute('content', keywords);
      document.getElementsByTagName('head')[0].appendChild(newMetaKeywords);
    }
  }, [title, description, keywords]);

  return null;
};

export default MetaTags;
