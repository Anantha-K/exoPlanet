import { NextRequest, NextResponse } from 'next/server'


export async function POST(NextRequest) {
    try {
        const body = await NextRequest.json()
        
        const {
            name,
            mass,
            radius,
            orbitalp,
            temp,
            atmosphere,
            magneticfield,
            oxygen,
            carbon,
            nitrogen
        } = body

        if (!name || !mass || !radius) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const newPlanet = {
            name,
            mass,
            radius,
            orbitalp,
            temp,
            atmosphere,
            magneticfield,
            oxygen,
            carbon,
            nitrogen,
        }

        

        return NextResponse.json(
            { 
                data: newPlanet
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error processing planet data:', error)
        return NextResponse.json(
            { error: 'Error'+error },
            { status: 500 }
        )
    }
}
