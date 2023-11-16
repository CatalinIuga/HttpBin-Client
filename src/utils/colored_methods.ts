function coloredHttpMethod(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return "text-green-500";
    case "POST":
      return "text-orange-500";
    case "HEAD":
      return "text-indigo-500";
    case "PUT":
      return "text-yellow-500";
    case "DELETE":
      return "text-red-500";
    case "PATCH":
      return "text-purple-500";
    case "OPTIONS":
      return "text-blue-500";
    case "TRACE":
      return "text-pink-500";
    default:
      return "text-gray-500";
  }
}

export { coloredHttpMethod };
