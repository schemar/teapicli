import Environment from "./Environment";
import Request from "./Request";

describe("Environment", () => {
  describe("Apply to request", () => {
    it("replaces variables in the URL, headers, and body", () => {
      // Arrange
      const environment: Environment = new Environment({
        name: "testenv",
        variables: {
          id: 1,
          url: "example.com",
          auth: "abc",
        },
      });
      const request: Request = new Request({
        name: "testreq",
        method: "post",
        headers: {
          "x-api-key": "Bearer {{auth}}",
        },
        url: "https://{{url}}/{{id}}",
        body: '{"id": "{{id}}"}',
      });

      // Act
      const environmentalRequest = environment.applyTo(request);

      // Assert
      expect(environmentalRequest).toEqual(
        new Request({
          name: "testreq",
          method: "post",
          headers: {
            "x-api-key": "Bearer abc",
          },
          url: "https://example.com/1",
          body: '{"id": "1"}',
        })
      );
    });

    it("replaces nested variables identified by periods", () => {
      // Arrange
      const environment: Environment = new Environment({
        name: "testenv",
        variables: {
          "auth.token": "abc",
          url: {
            name: "example.com",
            ids: {
              one: 1,
              two: 2,
            },
          },
        },
      });
      const request: Request = new Request({
        name: "testreq",
        method: "post",
        headers: {
          "x-api-key": "Bearer {{auth.token}}",
        },
        url: "https://{{url.name}}/{{url.ids.one}}",
        body: '{"id": "{{url.ids.two}}"}',
      });

      // Act
      const environmentalRequest = environment.applyTo(request);

      // Assert
      expect(environmentalRequest).toEqual(
        new Request({
          name: "testreq",
          method: "post",
          headers: {
            "x-api-key": "Bearer abc",
          },
          url: "https://example.com/1",
          body: '{"id": "2"}',
        })
      );
    });
  });
});
