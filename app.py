import numpy as np
import streamlit as st
from PIL import Image

from streamlit_custom_image_labeller import st_custom_image_labeller


def load_image(image_path):
    sample_image = Image.open(image_path)
    img_array = np.array(sample_image)
    if img_array.max() > 255:
        img_array = (
            (img_array - img_array.min())
            / (img_array.max() - img_array.min())
            * 255
        )
    return Image.fromarray(img_array)


st.title("Testing Streamlit custom components")
sample_image = load_image("image/20220426.161203.996.CD8-007_RI MIP.tiff")
output = st_custom_image_labeller(sample_image)
st.write(output)  # type:ignore
