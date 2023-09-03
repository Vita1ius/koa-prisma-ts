import app from "./app";
import logger from './service/logger';
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
logger.info("APP started/restarted");