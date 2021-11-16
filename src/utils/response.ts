export const response200 = (data: any) => ({
  code: 200,
  data,
});

export const response404 = (message: string) => ({
  code: 404,
  message,
});
