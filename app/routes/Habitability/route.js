const { NextRequest, NextResponse } = require("next/server");

export async function POST(NextRequest) {
  try {
    const body = await NextRequest.json();

    const {
      distance,
      oxygen,
      nitrogen,
      temp,
      size,
      mass,
      radius,
      orbitalPeriod,
      StellarMass,
      StellarRadius,
      ETemp,
      SystemAge,
      atmosphericthickness,
      magneticfield,
      carbon,
    } = body;


    const newPlanet = {
      distance,
      oxygen,
      nitrogen,
      temp,
      size,
      mass,
      radius,
      orbitalPeriod,
      StellarMass,
      StellarRadius,
      ETemp,
      SystemAge,
      atmosphericthickness,
      magneticfield,
      carbon,
    };

    return NextResponse.json(
      
       newPlanet,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing planet data:", error);
    return NextResponse.json(
      { error: "Error" + error },
      { status: 500 }
    );
  }
}