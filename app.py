import logging
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import streamlit as st
import tifffile
from PIL import Image

from streamlit_custom_image_labeller import st_custom_image_labeller


@dataclass
class Point:
    x: int
    y: int
    z: int


class TomocubeImage:
    def __init__(self, image_path: Path):
        self.image_path = image_path

    def process(self):
        logging.info("Processing image to object")
        image_arr = self.read_image()
        image_arr = self.normalize_img(image_arr)
        # return self.numpy_to_image(image_arr)
        return image_arr

    def read_image(self) -> np.ndarray:
        return tifffile.imread(str(self.image_path))

    @staticmethod
    def normalize_img(img: np.ndarray) -> np.ndarray:
        return (img - np.min(img)) / (np.max(img) - np.min(img)) * 255

    @staticmethod
    def numpy_to_image(img_arr: np.ndarray) -> Image.Image:
        return Image.fromarray(img_arr)


class _3DTomocubeImage(TomocubeImage):
    @staticmethod
    def slice_axis(img_arr: np.ndarray, idx: int, axis: int) -> np.ndarray:
        logging.info(f"Slicing image array - {idx} on axis {axis}")
        return img_arr.take(indices=idx, axis=axis)


def set_point_state(image_size):
    if "point" not in st.session_state:
        logging.info("Set default point")
        st.session_state["point"] = Point(
            image_size[1] // 2, image_size[2] // 2, image_size[0] // 2
        )


def two_center_labeller(image_3d):
    if "output1" not in st.session_state:
        st.session_state["output1"] = {}
    if "output2" not in st.session_state:
        st.session_state["output2"] = {}
    set_point_state(image_3d.shape)

    col1, col2 = st.columns(2)
    st.session_state["xy_image"] = TomocubeImage.numpy_to_image(
        _3DTomocubeImage.slice_axis(
            image_3d, idx=st.session_state["point"].z, axis=0
        )
    )
    st.session_state["zx_image"] = TomocubeImage.numpy_to_image(
        _3DTomocubeImage.slice_axis(
            image_3d, idx=st.session_state["point"].y, axis=2
        )
    )

    with col1:
        logging.info("render col1")
        st.header("HT - XY")
        output1 = st_custom_image_labeller(
            st.session_state["xy_image"],
            point=(st.session_state["point"].y, st.session_state["point"].x),
        )
        if output1 != st.session_state["output1"]:
            st.session_state["output1"] = output1
            st.session_state["point"] = Point(
                st.session_state["output1"]["y"],
                st.session_state["output1"]["x"],
                st.session_state["point"].z,
            )
            st.session_state["zx_image"] = TomocubeImage.numpy_to_image(
                _3DTomocubeImage.slice_axis(
                    image_3d, idx=st.session_state["output1"]["x"], axis=0
                )
            )
        st.write(output1)
        st.write(st.session_state["output1"])

    with col2:
        logging.info("render col2")
        st.header("HT - ZY")
        output2 = st_custom_image_labeller(
            st.session_state["zx_image"],
            point=(st.session_state["point"].x, st.session_state["point"].z),
        )
        if output2 != st.session_state["output2"]:
            st.session_state["output2"] = output2
            st.session_state["point"] = Point(
                st.session_state["output2"]["x"],
                st.session_state["point"].y,
                st.session_state["output2"]["y"],
            )
            st.session_state["xy_image"] = TomocubeImage.numpy_to_image(
                _3DTomocubeImage.slice_axis(
                    image_3d, idx=st.session_state["output2"].get("y"), axis=0
                )
            )
        st.write(output2)
        st.write(st.session_state["output2"])

    logging.info("=" * 100)


def render_title():
    logging.info("Render title")
    st.title("Tomocube Cell Center Labeller")


if __name__ == "__main__":
    render_title()
    image_path = Path(
        "streamlit_custom_center_labeller/image/20220610.161316.760.CD4_2-001_RI Tomogram.tiff"
    )

    if ("image_path" not in st.session_state) or (
        image_path != st.session_state["image_path"]
    ):
        st.session_state["image_path"] = image_path
        st.session_state["image_3d"] = _3DTomocubeImage(image_path).process()
    two_center_labeller(st.session_state["image_3d"])
