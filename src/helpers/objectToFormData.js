export const objectToFormData = (obj, form = new FormData(), namespace = "") => {
	for (let key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

		const value = obj[key];
		if (value === null || value === undefined) continue;

		const formKey = namespace ? `${namespace}[${key}]` : key;

		if (value instanceof File) {
			form.append(formKey, value);
		} else if (Array.isArray(value)) {
			value.forEach((element, index) => {
				const arrayKey = `${formKey}[${index}]`;
				if (typeof element === "object" && !(element instanceof File)) {
					objectToFormData(element, form, arrayKey); // recurse into array element
				} else {
					// ✅ Convert boolean inside arrays too
					form.append(arrayKey, typeof element === "boolean" ? (element ? 1 : 0) : element);
				}
			});
		} else if (typeof value === "object") {
			objectToFormData(value, form, formKey); // recurse into object
		} else {
			// ✅ Convert top-level booleans to 1/0
			form.append(formKey, typeof value === "boolean" ? (value ? 1 : 0) : value);
		}
	}
	return form;
};
