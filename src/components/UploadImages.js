// uploadimages.js
const uploadToImgbb = async (imageFile) => {
  const apiKey = "0f63747bcdbaa91c90d06ba0b4b3cfae"; 

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success) return data.data.url;
  else throw new Error("Image upload failed");
};

export default uploadToImgbb;
