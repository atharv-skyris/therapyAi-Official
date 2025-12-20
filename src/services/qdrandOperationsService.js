import qdrantClient from "../config/qdrantdbConfig.js";
import { v4 as uuidv4 } from 'uuid';

export async function appendEmbedding(vectors, isNote, payload) {
  console.log("appendEmbedding function");

  const finalPayload = isNote
    ? {
        _id: payload._id,
        email: payload.email,
        isNote: true,
      }
    : { email: payload.email, isNote: false, text: payload.text };

  console.log("finalPayload", finalPayload);

  const points = vectors.map((vec ,  index)=>{
    finalPayload["obj"] =  payload.text[index]  || ""
    return {
      id:uuidv4(),
      vector:vec,
      payload:finalPayload
    }

  })

  console.log(points)

  try {
    await qdrantClient.upsert("Therapy-ai", {points});
    console.log("Embedding appended successfully");
    return {
      success: true,
      message: "Embedding appended successfully",
    };
  } catch (error) {
    console.log(
      "error in appendEmbedding function in qdrantOperationsService",
      error
    );
    return {
      success: false,
      message: "Error in appendEmbedding function in qdrantOperationsService",
    };
  }
}

async function findPoint(_id) {
  const search = await qdrantClient.scroll("Therapy-ai", {
    filter: {
      must: [{ key: "_id", match: { value: _id } }],
    },
    limit: 1,
  });
  if (search.points.length === 0) {
    return {
      success: false,
      message: "No point found",
    };
  }
  return {
    success: true,
    message: search.points[0],
  };
}

export async function updateEmbedding(vector, payload) {
  console.log("updateEmbedding function");

  try {
    const point = await findPoint(payload._id);
    if (!point.success) {
      return point;
    }

    console.log("point found", point);

    const _id = point.message.id;
    console.log("_id", _id);

    await qdrantClient.upsert("Therapy-ai", {
      points: [
        {
          id: _id,
          vector,
          payload: {
            _id: payload._id,
            email: payload.email,
            isNote: true,
            text: payload.text,
          },
        },
      ],
    });

    return {
      success:true,
      message:"Updated successfully"
    }
  } catch (error) {
    console.log(
      "error in updateEmbedding function in qdrantOperationsService",
      error
    );
    return {
      success: false,
      message: "Error in updateEmbedding function in qdrantOperationsService",
    };
  }
}

export async function searchVector(vector, email) {
  console.log("searchVector function");
  try {
    const notes = await qdrantClient.search("Therapy-ai", {
      vector,
      limit: 10,
      with_vectors: false,
      filter: {
        must: [
          { key: "email", match: { value: email } },
        ],
      },
    });

    console.log("notes from qdrant", notes);

    // const nonNotes = await qdrantClient.search("Therapy-ai", {
    //   vector,
    //   limit: 5,
    //   with_vectors: false,
    //   filter: {
    //     must: [
    //       { key: "email", match: { value: email } },
    //       { key: "isNote", match: { value: false } },
    //     ],
    //   },
    // });
    // console.log("nonNotes from qdrant", nonNotes);

    return { success: true, data: notes };
  } catch (error) {
    console.log("Error in searchByVectorAndEmail:", error);
    return { success: false, message: "Failed to search embeddings" };
  }
}

export async function deleteVector(_id) {
  console.log("deleteVectors function");
  try {
    await qdrantClient.delete("Therapy-ai", {
      filter: {
        must: [{ key: "_id", match: { value: _id } }],
      },
    });
    console.log("Vector deleted successfully");
    return { success: true, message: "Vector deleted successfully" };
  } catch (error) {
    console.log("Error in deleteBy_Id:", error);
    return { success: false, message: "Failed to delete embedding" };
  }
}
