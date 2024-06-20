const express = require('express');
const router = express.Router();
const Mentor = require('../models/mentor');
const Student = require('../models/student');

// Create Mentor
router.post('/mentor', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create Student
router.post('/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Assign multiple students to a mentor
router.post('/assign-students-to-mentor', async (req, res) => {
  const { mentorId, studentIds } = req.body;
  try {
    const mentor = await Mentor.findById(mentorId);
    const students = await Student.find({ _id: { $in: studentIds }, mentor: { $exists: false } });

    if (students.length !== studentIds.length) {
      return res.status(400).send({ message: 'Some students already have mentors.' });
    }

    students.forEach(student => {
      student.mentor = mentor._id;
      mentor.students.push(student._id);
    });

    await Promise.all(students.map(student => student.save()));
    await mentor.save();

    res.send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Change or assign a mentor for a student
router.post('/assign-mentor-to-student', async (req, res) => {
  const { studentId, mentorId } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: 'Student not found.' });
    }

    if (student.mentor) {
      student.previousMentors.push(student.mentor);
    }

    student.mentor = mentorId;
    await student.save();

    await Mentor.findByIdAndUpdate(mentorId, { $addToSet: { students: studentId } });

    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Show all students for a particular mentor
router.get('/students-by-mentor/:mentorId', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate('students');
    if (!mentor) {
      return res.status(404).send({ message: 'Mentor not found.' });
    }
    res.send(mentor.students);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Show previously assigned mentors for a particular student
router.get('/previous-mentors-by-student/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('previousMentors');
    if (!student) {
      return res.status(404).send({ message: 'Student not found.' });
    }
    res.send(student.previousMentors);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
