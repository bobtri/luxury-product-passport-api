export function validateTransaction(req, res, next) {
  const { serialNumber, brand, model, fromAddress, toAddress, timestamp } =
    req.body;

  if (
    !serialNumber ||
    !brand ||
    !model ||
    !fromAddress ||
    !toAddress ||
    !timestamp
  ) {
    return res.status(400).json({
      error: 'Missing required transaction fields',
    });
  }

  next();
}
