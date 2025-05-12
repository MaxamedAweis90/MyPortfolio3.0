// lib/queries.js

export const getCertificatesQuery = `
  *[_type == "certificate"]
    | order(orderRank)
    {
      _id,
      title,
      issuer,
      issuedDate,
      category,
      imageRef->{
        image{
          asset->{
            url
          }
        }
      },
      link,
      verificationUrl,
      verificationCode,
      _createdAt
    }
`;