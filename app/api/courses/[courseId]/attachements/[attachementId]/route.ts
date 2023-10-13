import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachementId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachement = await db.attachement.delete({
      where: {
        courseId: params.courseId,
        id: params.attachementId,
      },
    });

    return NextResponse.json(attachement);
  } catch (error) {
    console.log("Attachement_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
