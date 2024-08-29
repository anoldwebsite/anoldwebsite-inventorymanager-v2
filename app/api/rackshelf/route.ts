// app/api/rackshelf/route.ts

// app/api/rackshelf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { country, project, rack, shelf } = await request.json();

  if (!country || !project || !rack || !shelf) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newRackShelf = await prisma.rackShelf.create({
      data: {
        country: country.trim().toUpperCase(),
        project: project.trim().toUpperCase(),
        rack: rack.trim().toUpperCase(),
        shelf: shelf.trim().toUpperCase(),
      },
    });
    return NextResponse.json(newRackShelf);
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        errorMessage =
          "This combination of country, project, rack, and shelf already exists. Please enter a unique combination.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const distinct = searchParams.get("distinct");
  const shelf = searchParams.get("shelf");

  try {
    if (shelf) {
      const rackShelf = await prisma.rackShelf.findFirst({
        where: {
          shelf: shelf.trim().toUpperCase(),
          rack: {
            not: "NULL_PLACEHOLDER",
          },
        },
      });

      if (!rackShelf) {
        return NextResponse.json(
          { error: "Rack not found for the given shelf" },
          { status: 404 }
        );
      }

      return NextResponse.json({ rack: rackShelf.rack });
    }

    if (distinct === "rack") {
      const distinctRacks = await prisma.rackShelf.findMany({
        distinct: ["rack"],
        select: {
          rack: true,
        },
        orderBy: {
          rack: "asc",
        },
      });
      return NextResponse.json(distinctRacks.map((rack) => rack.rack));
    }

    const rackShelves = await prisma.rackShelf.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(rackShelves);
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
