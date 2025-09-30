const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgresConfig");

const Group = sequelize.define(
  "Group",
  {
    GroupID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    GroupName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Group name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "Group name must be between 2 and 100 characters",
        },
      },
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Description cannot exceed 500 characters",
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
    tableName: "Groups",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

// Class methods
Group.createGroup = async (groupData) => {
  try {
    const { GroupName, Description } = groupData;

    // Validate required fields
    if (!GroupName || GroupName.trim() === "") {
      throw new Error("Group name is required");
    }

    // Check if group name already exists
    const existingGroup = await Group.findOne({
      where: {
        GroupName: GroupName.trim(),
        IsDeleted: false,
      },
    });

    if (existingGroup) {
      throw new Error("Group name already exists");
    }

    // Create new group
    const newGroup = await Group.create({
      GroupName: GroupName.trim(),
      Description: Description ? Description.trim() : null,
      IsDeleted: false,
    });

    return {
      success: true,
      data: newGroup,
      message: "Group created successfully",
    };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      success: false,
      message: error.message || "Failed to create group",
    };
  }
};

Group.getAllGroups = async () => {
  try {
    const groups = await Group.findAll({
      where: {
        IsDeleted: false,
      },
      order: [["CreatedAt", "DESC"]],
    });

    return {
      success: true,
      data: groups,
      message: "Groups retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return {
      success: false,
      message: "Failed to fetch groups",
    };
  }
};

Group.getGroupById = async (groupId) => {
  try {
    if (!groupId) {
      throw new Error("Group ID is required");
    }

    const group = await Group.findOne({
      where: {
        GroupID: groupId,
        IsDeleted: false,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    return {
      success: true,
      data: group,
      message: "Group retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching group:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch group",
    };
  }
};

Group.updateGroup = async (groupId, updateData) => {
  try {
    if (!groupId) {
      throw new Error("Group ID is required");
    }

    const { GroupName, Description } = updateData;

    // Find the group
    const group = await Group.findOne({
      where: {
        GroupID: groupId,
        IsDeleted: false,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    // Validate group name if provided
    if (GroupName !== undefined) {
      if (!GroupName || GroupName.trim() === "") {
        throw new Error("Group name cannot be empty");
      }

      // Check if new group name already exists (excluding current group)
      const existingGroup = await Group.findOne({
        where: {
          GroupName: GroupName.trim(),
          IsDeleted: false,
          GroupID: { [require("sequelize").Op.ne]: groupId },
        },
      });

      if (existingGroup) {
        throw new Error("Group name already exists");
      }
    }

    // Update group
    const updateFields = {};
    if (GroupName !== undefined) updateFields.GroupName = GroupName.trim();
    if (Description !== undefined)
      updateFields.Description = Description ? Description.trim() : null;

    await group.update(updateFields);

    return {
      success: true,
      data: group,
      message: "Group updated successfully",
    };
  } catch (error) {
    console.error("Error updating group:", error);
    return {
      success: false,
      message: error.message || "Failed to update group",
    };
  }
};

Group.deleteGroup = async (groupId) => {
  try {
    if (!groupId) {
      throw new Error("Group ID is required");
    }

    const group = await Group.findOne({
      where: {
        GroupID: groupId,
        IsDeleted: false,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    // Soft delete the group
    await group.update({ IsDeleted: true });

    return {
      success: true,
      message: "Group deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      success: false,
      message: error.message || "Failed to delete group",
    };
  }
};

// Define associations
Group.associate = (models) => {
  Group.hasMany(models.Member, {
    foreignKey: "GroupID",
    as: "Members",
    onDelete: "CASCADE",
  });
};

module.exports = Group;
