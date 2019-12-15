class TreeNode {
  constructor({ name, parent, lvl }) {
    this.name = name;
    this.parent = parent;
    this.lvl = lvl;
    this.descendents = [];
  }
}

module.exports = TreeNode;
