const express = require("express");
const router = express.Router();
const Group = require("../models/groupModel");
const Member = require("../models/memberModel");

// GET /api/groups - Get all groups
router.get("/", async (req, res) => {
  try {
    const result = await Group.getAllGroups();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/groups:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/groups/:id - Get group by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Group.getGroupById(id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/groups/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/groups/:id/members - Get all members of a specific group
router.get("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if group exists
    const groupResult = await Group.getGroupById(id);
    if (!groupResult.success) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    
    const result = await Member.getMembersByGroupId(id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/groups/:id/members:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/groups - Create a new group
router.post("/", async (req, res) => {
  try {
    const { GroupName, Description } = req.body;
    
    // Validate required fields
    if (!GroupName || GroupName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }
    
    const result = await Group.createGroup({
      GroupName,
      Description,
    });
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in POST /api/groups:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/groups/:id - Update a group
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { GroupName, Description } = req.body;
    
    const result = await Group.updateGroup(id, {
      GroupName,
      Description,
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in PUT /api/groups/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/groups/:id - Delete a group (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if group has members
    const membersResult = await Member.getMembersByGroupId(id);
    if (membersResult.success && membersResult.data.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete group. It has ${membersResult.data.length} active members. Please delete all members first.`,
      });
    }
    
    const result = await Group.deleteGroup(id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in DELETE /api/groups/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/groups/:id/cascade - Delete a group and all its members (cascade delete)
router.delete("/:id/cascade", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all members of the group first
    const membersResult = await Member.getMembersByGroupId(id);
    let deletedMembersCount = 0;
    
    if (membersResult.success && membersResult.data.length > 0) {
      // Delete all members first
      for (const member of membersResult.data) {
        await Member.deleteMember(member.MemberID);
        deletedMembersCount++;
      }
    }
    
    // Then delete the group
    const result = await Group.deleteGroup(id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Group deleted successfully along with ${deletedMembersCount} members`,
        deletedMembersCount,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in DELETE /api/groups/:id/cascade:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
