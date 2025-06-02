// utils.js
function slugify(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}
