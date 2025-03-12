module.exports = (req, res, next) => {
    const { cpuUsage, gpuUsage } = req.body;
  
    if (cpuUsage > 90 || gpuUsage > 90) {
      return res.status(403).json({ message: "Unauthorized mining detected!" });
    }
  
    next();
  };
  