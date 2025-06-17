const paginateReq = (page: number, limit: number) => {
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const skip = (pageNumber - 1) * limitNumber;

  return { pageNumber, limitNumber, skip };
};

const paginateRes = (params: { totalCount: number, pageNumber: number, limitNumber: number }) => {
  const { limitNumber, pageNumber, totalCount } = params;
  const totalPages = Math.ceil(totalCount / limitNumber);

  return {
    currentPage: pageNumber,
    totalPages: totalPages,
  };
};

export { paginateReq, paginateRes };
