const Router = require("express");
const router = new Router();
const subjects_teachersController = require("../controller/subjects_teachers.controller");
const jwtAuthMiddleware = require("../middleware/auth");

router.post(
  "/subjects_teachers",
  jwtAuthMiddleware,
  subjects_teachersController.createSubjectTeacher
);
router.post(
  "/subjects_teachers/undo",
  jwtAuthMiddleware,
  subjects_teachersController.undoSubjectsTeacher.bind(
    subjects_teachersController
  )
);
router.get(
  "/subjects_teachers",
  jwtAuthMiddleware,
  subjects_teachersController.getAllSubjectTeacher
);
router.put(
  "/subjects_teachers/:id",
  jwtAuthMiddleware,
  subjects_teachersController.updateSubjectTeacher
);
router.delete(
  "/subjects_teachers/:id",
  jwtAuthMiddleware,
  subjects_teachersController.deleteSubjectTeacher
);

module.exports = router;
