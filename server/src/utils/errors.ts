export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}