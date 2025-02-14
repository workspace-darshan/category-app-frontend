import React, { useState } from "react";
import IndeterminateCheckBoxRoundedIcon from "@mui/icons-material/IndeterminateCheckBoxRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { styled, alpha } from "@mui/material/styles";
import { IoMdAdd } from "react-icons/io";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Button, Modal, Box, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useApi } from "../context/AuthContext";
import Select from '@mui/material/Select';
import toast from 'react-hot-toast';
import { Divider } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CustomDialog from './CustomDialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

const ExpandIcon = (props) => <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
const CollapseIcon = (props) => <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;

// Static category data (supports deep nesting)
const staticCategories = [
    {
        _id: "1",
        name: "Electronics",
        status: "active",
        children: [
            {
                _id: "1-1",
                name: "Phones",
                status: "active",
                children: [
                    { _id: "1-1-1", name: "Vivo", status: "active", children: [] },
                    { _id: "1-1-2", name: "Oppo", status: "active", children: [] },
                    { _id: "1-1-3", name: "Samsung", status: "active", children: [] },
                ],
            },
        ],
    },
    {
        _id: "2",
        name: "Fashion",
        status: "active",
        children: [
            { _id: "2-1", name: "Men", status: "active", children: [] },
            { _id: "2-2", name: "Women", status: "active", children: [] },
        ],
    },
];

const Tree = () => {
    const { logout, isLoggedIn, apiClient } = useApi();
    const [categories, setCategories] = useState(staticCategories);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [categoryName, setCategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parentCategoryName, setParentCategoryName] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('active'); // Default to "Active"

    const handleOpenModal = (type, category = null) => {
        setModalType(type);
        setSelectedCategory(category);
        if (type === "add") {
            setCategoryName("");
        } else {
            setCategoryName(category?.name);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCategoryName("");
        setSelectedCategory(null);
    };

    const handleSubmit = async () => {
        try {

            toast.success("Category added successfully!");
            // Reset inputs after successful category addition
            setCategoryName('');
            setCategoryStatus('active'); // Reset status to default "Active"
            // Close modal
            handleModalClose();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Recursive function to update categories
    const updateCategoryTree = (list, targetId, newCategory) => {
        return list.map((cat) => {
            if (cat._id === targetId) {
                return { ...cat, children: [...cat.children, newCategory] };
            }
            if (cat.children.length > 0) {
                return { ...cat, children: updateCategoryTree(cat.children, targetId, newCategory) };
            }
            return cat;
        });
    };

    // Recursive function to edit category
    const editCategoryTree = (list, targetId, newName) => {
        return list.map((cat) => {
            if (cat._id === targetId) {
                return { ...cat, name: newName };
            }
            if (cat.children.length > 0) {
                return { ...cat, children: editCategoryTree(cat.children, targetId, newName) };
            }
            return cat;
        });
    };

    const deleteCategoryTree = (list, targetId, parentId = null) => {
        return list
            .map((cat) => {
                if (cat._id === targetId) {
                    return null; // Mark for deletion
                }

                if (cat.children && cat.children.length > 0) {
                    cat.children = deleteCategoryTree(cat.children, targetId, cat._id);
                }

                return cat;
            })
            .flatMap(cat => {
                if (cat === null) {
                    // Find the deleted category
                    const deletedCategory = list.find(c => c._id === targetId);
                    return deletedCategory ? deletedCategory.children.map(child => ({ ...child, parent: parentId })) : [];
                }
                return cat;
            });
    };

    const handleSaveCategory = () => {
        if (!categoryName.trim()) return;

        const newCategory = {
            _id: `${Date.now()}`,
            name: categoryName,
            status: categoryStatus,
            children: [],
        };

        if (modalType === "add") {
            if (selectedCategory) {
                // Add as a child category
                setCategories((prev) => updateCategoryTree(prev, selectedCategory._id, newCategory));
            } else {
                // Add as a new parent category
                setCategories((prev) => [...prev, newCategory]);
            }
        } else if (modalType === "edit") {
            setCategories((prev) => editCategoryTree(prev, selectedCategory._id, categoryName));
        }

        handleCloseModal();
    };


    const handleDeleteCategory = (categoryId) => {
        setCategories((prev) => deleteCategoryTree(prev, categoryId));
    };

    return (
        <>
            <div className="addCategory button" style={{ marginBottom: "20px" }}>
                <button onClick={() => handleOpenModal("add", null)}>
                    Add Parent Category <IoMdAdd style={{ fontWeight: "bold", fontSize: "17px" }} />
                </button>
            </div>

            <SimpleTreeView
                aria-label="categories-tree"
                slots={{ expandIcon: ExpandIcon, collapseIcon: CollapseIcon }}
                sx={{ overflowX: "hidden", minHeight: 270, flexGrow: 1, width: "100%" }}
            >
                {categories.map((category) => (
                    <CategoryTreeItem
                        key={category._id}
                        category={category}
                        onAdd={handleOpenModal}
                        onDelete={handleDeleteCategory}
                    />
                ))}
            </SimpleTreeView>

            {/* Modal for adding/editing categories */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 3,
                        boxShadow: 24,
                        borderRadius: 2,
                        minWidth: 300,
                    }}
                >
                    <h3>{modalType === "add" ? "Add Category" : "Edit Category"}</h3>
                    <TextField
                        fullWidth
                        label="Category Name"
                        variant="outlined"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveCategory} fullWidth>
                        {modalType === "add" ? "Add" : "Save"}
                    </Button>
                </Box>
            </Modal>

            {/* Custom Modal for adding category */}
            <CustomDialog open={isModalOpen} onCancel={handleModalClose} maxWidth="sm">
                <DialogTitle>Add Category</DialogTitle>
                <Divider />
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        type="text"
                        fullWidth
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={categoryStatus}
                            onChange={(e) => setCategoryStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button variant='contained' onClick={handleModalClose} color="error">
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={handleSubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </CustomDialog>
        </>
    );
};

const CategoryTreeItem = ({ category, onAdd, onDelete }) => (
    <CustomTreeItem
        itemId={category._id}
        label={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{category.name}</span>
                <IconButton size="small" onClick={() => onAdd("edit", category)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(category._id)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onAdd("add", category)}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </div>
        }
    >
        {category.children.map((child) => (
            <CategoryTreeItem key={child._id} category={child} onAdd={onAdd} onDelete={onDelete} />
        ))}
    </CustomTreeItem>
);

export default Tree;
