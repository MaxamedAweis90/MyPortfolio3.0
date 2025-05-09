// components/Seo.js
const Seo = ({ title, description, url, image }) => {
    return (
      <>
        {/* Standard SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
  
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
  
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </>
    );
  };
  
  export default Seo;
  