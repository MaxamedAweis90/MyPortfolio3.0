// structure.js
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Replace the default certificate list with orderable one
      orderableDocumentListDeskItem({
        type: 'certificate',
        title: 'Certificates',
        S,
        context,
      }),
      // Include all other document types, except 'certificate'
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'certificate'
      ),
    ])
