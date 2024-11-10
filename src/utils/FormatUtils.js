class FormatUtils {
  static formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  static splitByComma(string) {
    return string.split(",");
  }

  static splitByDashSlice(start, end, string) {
    return string.slice(start, end).split("-");
  }
}

export default FormatUtils;
