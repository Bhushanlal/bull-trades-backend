export const responseHandler = (
    res: any,
    error: boolean,
    message: string = "Something went wrong",
    data: any = null,
    statusCode: number = 500
  ) => {
    return res.status(statusCode).json({
      error,
      message,
      data,
    });
  };
  