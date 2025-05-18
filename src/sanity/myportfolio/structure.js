import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export const structure = (S, context) =>
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

      // 🆕 Make Projects orderable
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
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

      // Include all other types except 'certificate' and 'project'
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== 'certificate' &&
          item.getId() !== 'project' && 
          item.getId() !== 'category'

          
      ),
    ])
