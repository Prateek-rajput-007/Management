import { checkAuth, connectDB } from "../../../../utils/features";
import { Task } from "../../../../models/task";
import { asyncError, errorHandler } from "../../../../middlewares/error";

const handler = asyncError(async (req, res) => {
  await connectDB();
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");

  const taskId = req.query.id;

  const task = await Task.findById(taskId);

  if (!task) return errorHandler(res, 404, "Task not found");

  if (req.method === "PUT") {
    const { includeInPdf } = req.body;

    task.includeInPdf = includeInPdf;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated for PDF inclusion",
    });
  } else {
    errorHandler(res, 400, "This method is not available");
  }
});

export default handler;
