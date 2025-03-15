import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const notifications = await Notification.find({ to: userId })
      .populate("from", "username")
      .sort({ createdAt: -1 });

    await Notification.updateMany(
      { to: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json(notifications);
  } catch (err) {
    console.log("Error in getNotifications", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "All notifications deleted" });
  } catch (err) {
    console.log("Error in deleteNotifications", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationid = req.params.id;
    const userId = req.user._id.toString();
    const notification = await Notification.findById(notificationid);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId) {
      return res
        .status(401)
        .json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.findByIdAndDelete(notificationid);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.log("Error in deleteNotification", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
