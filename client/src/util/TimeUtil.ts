// TimeUtil.ts

export class TimeUtil {
    // Define the common date-time pattern
    private static readonly PATTERN = "yyyy-MM-dd'T'HH:mm";

    /**
     * Converts a Date object into a formatted date-time string.
     * The output format will be "yyyy-MM-dd'T'HH:mm".
     *
     * @param date the Date object to be converted
     * @return the corresponding date-time string
     */
    public static dateToString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * Converts a date-time string into a Date object.
     * The string must follow the format "yyyy-MM-dd'T'HH:mm".
     *
     * @param dateString the date-time string to be converted
     * @return the corresponding Date object
     * @throws Error if the string is not in the correct format
     */
    public static stringToDate(dateString: string): Date {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!dateRegex.test(dateString)) {
            throw new Error("Invalid dateTime format: " + dateString);
        }

        return new Date(dateString);
    }


    /**
     * Get the first Sunday and last Saturday of the current month
     * based on the input date string (yyyy-MM-dd).
     *
     * @param currentDateString the input date string in yyyy-MM-dd format
     * @return an object containing the first Sunday and last Saturday of the month
     */
    public static getFirstSundayAndLastSaturday(currentDateString: string): { start: string, end: string } {
        // Convert input string to Date
        const currentDate = this.stringToDate(currentDateString);

        // Move to the first day of the month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Calculate the first Sunday of the month
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        const firstSunday = new Date(firstDayOfMonth);
        if (firstDayOfWeek !== 0) {
            // Move back to the previous Sunday
            firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfWeek);
        }

        // Move to the last day of the month
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Calculate the last Saturday of the month
        const lastDayOfWeek = lastDayOfMonth.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        const lastSaturday = new Date(lastDayOfMonth);
        if (lastDayOfWeek !== 6) {
            // Move back to the previous Saturday
            lastSaturday.setDate(lastDayOfMonth.getDate() - (lastDayOfWeek + 1) + 7);
        }

        const start: string = this.dateToString(firstSunday);
        const end: string = this.dateToString(lastSaturday);

        return { start, end};
    }
}