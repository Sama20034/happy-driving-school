export interface BookingData {
  countryId: string;
  countryName: string;
  governorateId: string;
  governorateName: string;
  branchId: string;
  branchName: string;
  transmissionType: "manual" | "automatic" | "";
  courseId: string;
  courseName: string;
  coursePrice: number;
  courseSessions: number;
  captainId: string;
  captainName: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerNotes: string;
}

export const initialBookingData: BookingData = {
  countryId: "",
  countryName: "",
  governorateId: "",
  governorateName: "",
  branchId: "",
  branchName: "",
  transmissionType: "",
  courseId: "",
  courseName: "",
  coursePrice: 0,
  courseSessions: 0,
  captainId: "",
  captainName: "",
  date: "",
  time: "",
  customerName: "",
  customerPhone: "",
  customerNotes: "",
};
