export const Result = {
  ok: (data) => ({
    success: true,
    data: data
  }),

  fail: (error) => ({
    success: false,
    error: error
  })
};