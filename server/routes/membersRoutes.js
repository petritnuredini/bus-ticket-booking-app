const express = require("express");
const router = express.Router();
const Member = require("../models/memberModel");
const Group = require("../models/groupModel");

// GET /api/members - Get all members
router.get("/", async (req, res) => {
  try {
    const result = await Member.getAllMembers();
    
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
    console.error("Error in GET /api/members:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/members/:id - Get member by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Member.getMemberById(id);
    
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
    console.error("Error in GET /api/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/members/group/:groupId - Get members by group ID
router.get("/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await Member.getMembersByGroupId(groupId);
    
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
    console.error("Error in GET /api/members/group/:groupId:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/members - Create a new member
router.post("/", async (req, res) => {
  try {
    const { Name, Role, GroupID } = req.body;
    
    // Validate required fields
    if (!Name || Name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Member name is required",
      });
    }
    
    if (!Role || Role.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Member role is required",
      });
    }
    
    if (!GroupID) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }
    
    const result = await Member.createMember({
      Name,
      Role,
      GroupID,
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
    console.error("Error in POST /api/members:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /api/members/:id - Update a member
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Role, GroupID } = req.body;
    
    const result = await Member.updateMember(id, {
      Name,
      Role,
      GroupID,
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
    console.error("Error in PUT /api/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/members/:id - Delete a member (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Member.deleteMember(id);
    
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
    console.error("Error in DELETE /api/members/:id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/members/bulk-delete - Delete multiple members
router.post("/bulk-delete", async (req, res) => {
  try {
    const { memberIds } = req.body;
    
    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Member IDs array is required",
      });
    }
    
    let deletedCount = 0;
    const errors = [];
    
    for (const memberId of memberIds) {
      try {
        const result = await Member.deleteMember(memberId);
        if (result.success) {
          deletedCount++;
        } else {
          errors.push(`Member ${memberId}: ${result.message}`);
        }
      } catch (error) {
        errors.push(`Member ${memberId}: ${error.message}`);
      }
    }
    
    if (deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: `${deletedCount} members deleted successfully`,
        deletedCount,
        errors: errors.length > 0 ? errors : undefined,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No members were deleted",
        errors,
      });
    }
  } catch (error) {
    console.error("Error in POST /api/members/bulk-delete:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
