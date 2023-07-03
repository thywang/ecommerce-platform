import { ChangeEvent } from "react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "../utilities/useForm";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";

interface TestData {
  username: string;
  bool: boolean;
  num: number;
}

describe("useForm", () => {
  const getFakeTestEvent = (value: any = "") =>
    ({
      preventDefault: vi.fn(),
      target: { value },
    } as unknown as ChangeEvent<any>);

  describe("smoke test", () => {
    it("should be a function", () => {
      expect(typeof useForm).toBe("function");
    });
  });

  describe("updating", () => {
    it("should update the data", () => {
      const { result } = renderHook(() => useForm<TestData>());
      expect(result.current.data.username).toBeUndefined();
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("test"));
      });

      expect(result.current.data.username).toBe("test");
    });

    it("should initialize the data", () => {
      const { result } = renderHook(() =>
        useForm<TestData>({
          initialValues: {
            username: "John",
          },
        })
      );

      expect(result.current.data.username).toBe("John");
      expect(result.current.data.bool).toBeUndefined();
    });
  });

  describe("validation", () => {
    it("should call the onSubmit callback when there are no errors", () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          onSubmit,
        })
      );
      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("should validate required values", () => {
      const requiredMessage = "This field is required";
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            username: {
              required: {
                value: true,
                message: requiredMessage,
              },
            },
          },
          onSubmit,
        })
      );

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.username).toBe(requiredMessage);
    });

    it("should validate custom validations", () => {
      const validationMessage = "The minimum length is 7 characters.";
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            username: {
              custom: {
                isValid: (value) => value?.length > 6,
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Username is long enough
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("testuser"));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(result.current.errors.username).toBeUndefined();

      // Username is too short
      onSubmit.mockReset();
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("123"));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.username).toBe(validationMessage);
    });

    it("should validate multiple validations", () => {
      const validationMessage = "This field isn't formatted correctly.";
      const requiredMessage = "This field is required";
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            username: {
              custom: {
                isValid: (value) => RegExp("/[A-Za-z]*/").test(value),
                message: validationMessage,
              },
              required: {
                value: true,
                message: requiredMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Username contains numbers
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("123"));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    it("should reset errors on submit", () => {
      const validationMessage = "The minimum length is 7 characters.";
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            username: {
              custom: {
                isValid: (value) => value?.length > 6,
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Username is too short
      onSubmit.mockReset();
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("123"));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.username).toBe(validationMessage);

      // Username is long enough
      act(() => {
        result.current.handleChange("username")(getFakeTestEvent("testuser"));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(result.current.errors.username).toBeUndefined();
    });
  });
});
