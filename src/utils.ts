export const queryBuilder = (
  title: string,
  items: [string, number][],
  procedure: string[],
  history: number[]
) => {
  let url = `?title=${encodeURIComponent(title)}&items=${items
    .flat()
    .map(encodeURIComponent)
    .join(",")}&procedure=${procedure.map(encodeURIComponent).join(",")}`;

  if (history.length > 0) {
    url += `&history=${history.map(encodeURIComponent).join(",")}`;
  }

  return url;
};
