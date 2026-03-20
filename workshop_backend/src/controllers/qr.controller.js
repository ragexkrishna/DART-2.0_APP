import QRCode from "qrcode"

export const generateWorkshopQR = async (req, res) => {

  try {

    const { workshopId } = req.params

    const attendanceURL = `http://localhost:5173/attendance/${workshopId}`

    const qr = await QRCode.toDataURL(attendanceURL)

    res.json({
      workshopId,
      qr
    })

  } catch (error) {

    res.status(500).json({
      message: "QR generation failed"
    })

  }

}