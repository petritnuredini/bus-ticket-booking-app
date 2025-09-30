const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgresConfig");

const Member = sequelize.define(
  "Member",
  {
    MemberID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Member name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "Member name must be between 2 and 100 characters",
        },
      },
    },
    Role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Member role cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "Member role must be between 2 and 50 characters",
        },
      },
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Groups",
        key: "GroupID",
      },
      validate: {
        notNull: {
          msg: "Group ID is required",
        },
        isInt: {
          msg: "Group ID must be a valid integer",
        },
      },
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "Members",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

// Class methods
Member.createMember = async (memberData) => {
  try {
    const { Name, Role, GroupID } = memberData;

    // Validate required fields
    if (!Name || Name.trim() === "") {
      throw new Error("Member name is required");
    }
    if (!Role || Role.trim() === "") {
      throw new Error("Member role is required");
    }
    if (!GroupID) {
      throw new Error("Group ID is required");
    }

    // Check if group exists
    const Group = require("./groupModel");
    const groupExists = await Group.findOne({
      where: {
        GroupID: GroupID,
        IsDeleted: false,
      },
    });

    if (!groupExists) {
      throw new Error("Selected group does not exist");
    }

    // Create new member
    const newMember = await Member.create({
      Name: Name.trim(),
      Role: Role.trim(),
      GroupID: parseInt(GroupID),
      IsDeleted: false,
    });

    return {
      success: true,
      data: newMember,
      message: "Member created successfully",
    };
  } catch (error) {
    console.error("Error creating member:", error);
    return {
      success: false,
      message: error.message || "Failed to create member",
    };
  }
};

Member.getAllMembers = async () => {
  try {
    const Group = require("./groupModel");

    const members = await Member.findAll({
      where: {
        IsDeleted: false,
      },
      include: [
        {
          model: Group,
          as: "Group",
          attributes: ["GroupID", "GroupName"],
          where: {
            IsDeleted: false,
          },
        },
      ],
      order: [["CreatedAt", "DESC"]],
    });

    return {
      success: true,
      data: members,
      message: "Members retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    return {
      success: false,
      message: "Failed to fetch members",
    };
  }
};

Member.getMembersByGroupId = async (groupId) => {
  try {
    if (!groupId) {
      throw new Error("Group ID is required");
    }

    const members = await Member.findAll({
      where: {
        GroupID: groupId,
        IsDeleted: false,
      },
      order: [["CreatedAt", "DESC"]],
    });

    return {
      success: true,
      data: members,
      message: "Members retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching members by group:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch members",
    };
  }
};

Member.getMemberById = async (memberId) => {
  try {
    if (!memberId) {
      throw new Error("Member ID is required");
    }

    const Group = require("./groupModel");

    const member = await Member.findOne({
      where: {
        MemberID: memberId,
        IsDeleted: false,
      },
      include: [
        {
          model: Group,
          as: "Group",
          attributes: ["GroupID", "GroupName"],
          where: {
            IsDeleted: false,
          },
        },
      ],
    });

    if (!member) {
      throw new Error("Member not found");
    }

    return {
      success: true,
      data: member,
      message: "Member retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching member:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch member",
    };
  }
};

Member.updateMember = async (memberId, updateData) => {
  try {
    if (!memberId) {
      throw new Error("Member ID is required");
    }

    const { Name, Role, GroupID } = updateData;

    // Find the member
    const member = await Member.findOne({
      where: {
        MemberID: memberId,
        IsDeleted: false,
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    // Validate group if provided
    if (GroupID !== undefined) {
      const Group = require("./groupModel");
      const groupExists = await Group.findOne({
        where: {
          GroupID: GroupID,
          IsDeleted: false,
        },
      });

      if (!groupExists) {
        throw new Error("Selected group does not exist");
      }
    }

    // Update member
    const updateFields = {};
    if (Name !== undefined) updateFields.Name = Name.trim();
    if (Role !== undefined) updateFields.Role = Role.trim();
    if (GroupID !== undefined) updateFields.GroupID = parseInt(GroupID);

    await member.update(updateFields);

    return {
      success: true,
      data: member,
      message: "Member updated successfully",
    };
  } catch (error) {
    console.error("Error updating member:", error);
    return {
      success: false,
      message: error.message || "Failed to update member",
    };
  }
};

Member.deleteMember = async (memberId) => {
  try {
    if (!memberId) {
      throw new Error("Member ID is required");
    }

    const member = await Member.findOne({
      where: {
        MemberID: memberId,
        IsDeleted: false,
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    // Soft delete the member
    await member.update({ IsDeleted: true });

    return {
      success: true,
      message: "Member deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting member:", error);
    return {
      success: false,
      message: error.message || "Failed to delete member",
    };
  }
};

// Define associations
Member.associate = (models) => {
  Member.belongsTo(models.Group, {
    foreignKey: "GroupID",
    as: "Group",
    onDelete: "CASCADE",
  });
};

module.exports = Member;
