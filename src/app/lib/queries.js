// lib/queries.js
export const getCertificatesQuery = `
  *[_type == "certificate"]
    | order(_createdAt desc)
    {
      _id,
      title,
      issuer,
      imageRef->{
        image{
          asset->{
            url
          }
        }
      },
      link,
      verificationUrl,
      verificationCode, // Fetch the new verification code field
      _createdAt
    }
`;
