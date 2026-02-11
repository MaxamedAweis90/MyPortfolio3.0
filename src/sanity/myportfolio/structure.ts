import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export const structure = (S: any, context: any) =>
  S.list()
    .title('Content')
    .items([
      // Certificates - already orderable
      orderableDocumentListDeskItem({
        type: 'certificate',
        title: 'Certificates',
        S,
        context,
      }),

      orderableDocumentListDeskItem({
        type: 'webProject',
        title: 'Web Projects',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'mobileProject',
        title: 'Mobile Projects',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'designProject',
        title: 'Design Projects',
        S,
        context,
      }),

      // 🆕 Make categories orderable
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'category',
        S,
        context,
      }),

      // Include all other types except the custom lists above
      ...S.documentTypeListItems().filter(
        (item: { getId: () => string | undefined }) =>
          item.getId() !== 'certificate' &&
          item.getId() !== 'webProject' && 
          item.getId() !== 'mobileProject' && 
          item.getId() !== 'designProject' && 
          item.getId() !== 'category'

          
      ),
    ])
