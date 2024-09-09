// validateEventMiddleware.js
module.exports = (req, res, next) => {
  let {
    eventName,
    nameOfSpeaker,
    date,
    category,
    time,
    department,
    eligibleYear,
    isPaid,
    cost,
  } = req.body;

  isPaid = isPaid === "true";
  if (!isPaid && cost !== null) {
    cost = null;
  }
  if(isPaid && typeof(cost) === 'string') {
    // console.log("cost is string, converting it in a number")
    cost = Number(cost)
  }
  // console.log("isPaid is of type: ", typeof isPaid);
  // console.log("cost is of type: ",typeof cost);

  // Check if required fields are present
  if (
    !eventName ||
    !nameOfSpeaker ||
    !date ||
    !category ||
    !time ||
    !department ||
    !eligibleYear
  ) {
    return res
      .status(400)
      .json({ error: "All event fields are required except isPaid and cost" });
  }

  // Validate isPaid and cost
  if (typeof isPaid !== "boolean") {
    return res
      .status(400)
      .json({ message: "Validation Error", error: "isPaid must be a boolean" });
  }

  // If isPaid is true, cost must be a number
  if (isPaid && (cost === null || typeof cost !== "number")) {
    return res
      .status(400)
      .json({
        message: "Validation Error",
        error: "Cost must be a number if the event is paid",
      });
  }

  // If isPaid is false, cost should be null
  if (!isPaid && cost !== null) {
    return res
      .status(400)
      .json({
        message: "Validation Error",
        error: "Cost must be null if the event is not paid",
      });
  }

  // Update req.body with the new values
  req.body.isPaid = isPaid;
  req.body.cost = cost;

  // If validation passes, proceed to the next middleware or route handler
  next();
};
