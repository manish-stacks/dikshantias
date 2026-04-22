export const getPageContent = async (exam: string, page: string) => {
  const res = await fetch("/api/admin/page-content");

  const data = await res.json();

  return data.find(
    (item: any) =>
      item.exam === exam && item.page === page && item.status === true,
  );
};
