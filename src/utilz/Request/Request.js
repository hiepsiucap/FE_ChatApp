/** @format */

export const baseUrl = "http://localhost:8080";
export const postRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      withCredntials: true,
      credentials: "include",
      headers: {
        Accept: "application/json", // Đặt Accept header thành application/json
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      let message;
      if (data?.msg) {
        message = data.msg;
      } else if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }
      return { error: true, message };
    }
    return data;
  } catch (error) {
    return { error: true, message: error };
  }
};
export const patchRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "PATCH",
    withCredntials: true,
    credentials: "include",
    headers: {
      Accept: "application/json", // Đặt Accept header thành application/json
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.msg) {
      message = data.msg;
    } else if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
};
export const putRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "PUT",
    withCredntials: true,
    credentials: "include",
    headers: {
      Accept: "application/json", // Đặt Accept header thành application/json
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.msg) {
      message = data.msg;
    } else if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
};
export const getRequest = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json", // Đặt Accept header thành application/json
      "Content-Type": "application/json",
    },
    credentials: "include",
    withCredntials: true,
    // Bao gồm cookies nếu cần thiết
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.msg) {
      message = data.msg;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
  console.log(response);
};
export const GetMessageWithController = async (controller, id, page) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/chatrooms/detailChatroomMessage/${id}?page=${page}`,
      {
        signal: controller.signal,
        withCredntials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const reback = await response.json();
    if (!response.ok) {
      return { error: true, message: reback.message };
    } else return reback;
  } catch (e) {
    return { error: true, message: e };
  }
};
export const GetMessage = async (id, page) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/chatrooms/detailChatroomMessage/${id}?page=${page}`,
      {
        withCredntials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const reback = await response.json();
    if (!response.ok) {
      return { error: true, message: reback.message };
      // Swal.fire({
      //   title: "Tìm kiếm tin nhắn thất bại",
      //   text: reback.message,
      //   icon: "error",
      // });
    } else return reback;
  } catch (e) {
    return { error: true, message: e };
  }
};
