"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  Globe,
  Smartphone,
  Infinity,
  Book,
  PlayIcon,
} from "lucide-react";
import Image from "next/image";
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Subject {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;

  startDate?: string;
  endDate?: string;

  shortDescription?: string;
  longDescription?: string;

  batchPrice?: number;
  batchDiscountPrice?: number;

  category?: string;

  subjects?: Subject[];
}

interface BtnTypes {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: number | string) => void;
}

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState<string>("description");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);

  const [userId, setUserId] = useState<number | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { slug } = useParams() as { slug: string };

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    // password: "",
  });

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${apiUrl}/batchs/slug/${slug}`);
        const data = await res.json();
        // console.log("data",data)
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${apiUrl}/coupons`);
        const data = await res.json();
        setCoupons(data);
      } catch (error) {
        console.error("Coupon fetch error", error);
      }
    };

    fetchCoupons();
  }, []);

  const validCoupons = coupons.filter(
    (c) => c.isActive && new Date(c.validTill) > new Date(),
  );

  const originalPrice = course?.batchDiscountPrice || course?.batchPrice || 0;

  const subtotal = originalPrice;

  const discount = appliedCoupon
    ? appliedCoupon.discountType === "flat"
      ? appliedCoupon.discount
      : Math.min(
          (subtotal * appliedCoupon.discount) / 100,
          appliedCoupon.maxDiscount || Infinity,
        )
    : 0;

  const totalAmount = Math.round(subtotal - discount);

  const applyCoupon = () => {
    const coupon = validCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase(),
    );

    if (!coupon) {
      alert("Invalid coupon code");
      return;
    }

    if (subtotal < (coupon.minPurchase || 0)) {
      alert(`Minimum purchase ₹${coupon.minPurchase}`);
      return;
    }
    console.log("Applying coupon", coupon);
    setAppliedCoupon(coupon);
  };

  const initiatePayment = async () => {
    const user = JSON.parse(localStorage.getItem("userDataDikshant") || "{}");
    console.log("user from localStorage", user);
    try {
      setPaymentLoading(true);

      console.log("userId", user.id);
      const orderRes = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          type: "batch",
          itemId: course?.id,
          amount: subtotal,
          gst: 0,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const orderData = await orderRes.json();
      console.log("orderData", orderData);

      const { razorOrder, key } = orderData;

      const options = {
        key: key,
        amount: razorOrder.amount,
        currency: "INR",
        name: "Dikshant IAS",
        description: `Enrollment for ${course?.name}`,
        order_id: razorOrder.id,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },

        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${apiUrl}/orders/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // alert("Payment Successful 🎉");
              router.push("/success-payment");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.log(err);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async () => {
    const userData = JSON.parse(
      localStorage.getItem("userDataDikshant") || "{}",
    );
    console.log("userData before registration", userData);
    if (userData.id) {  
      return initiatePayment();
    }
    setIsRegisterModalOpen(true)
    try {
      const res = await fetch(`${apiUrl}/auth/web-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      console.log("User created");

      setIsRegisterModalOpen(false);

      console.log("data", data);
      localStorage.setItem("userDataDikshant", JSON.stringify(data.user)); // Store token for authentication
      setUserId(data.user.id); // Store user ID for later use (if needed)

      // 👉 register के बाद payment
      initiatePayment();
    } catch (error) {
      console.error(error);
    }
  };
  const TabButton = ({ id, label, isActive, onClick }: BtnTypes) => (
    <button
      onClick={() => onClick(id)}
      className={`py-2 font-bold text-lg border-b-2 transition-colors ${
        isActive
          ? "border-red-500 text-red-600"
          : "border-transparent text-gray-600 hover:text-gray-800"
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <Skeleton height={300} />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div>
      {/* Header */}
      <div className="container max-w-7xl mx-auto bg-blue-100 mt-3 px-3 md:mt-4 rounded-2xl py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1">
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#040c33] mb-4 leading-tight">
                {course.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-blue-950 mb-4">
                <p>
                  A course by <span className="font-bold">Dikshant IAS</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-blue-900 mb-4">
                <div className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  <span>Subjects - {course.subjects?.length || 0}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{course.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full">
                  <span>{course.category}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80">
              <Image
                width={600}
                height={600}
                src={course.imageUrl || "/img/Prelims-Foundation-Course.webp"}
                alt={course.name}
                className="w-full rounded-lg shadow-lg border-5 border-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-8">
                <TabButton
                  id="description"
                  label="Course Overview"
                  isActive={activeTab === "description"}
                  onClick={() => setActiveTab("description")}
                />
              </nav>
            </div>

            {/* Description */}
            {activeTab === "description" && (
              <div>
                <div className="prose max-w-none text-justify">
                  {parse(course.longDescription || "")}
                </div>

                {/* Subjects */}
                {course.subjects && course.subjects.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Course Subjects</h2>

                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {course.subjects.map((sub) => (
                        <li
                          key={sub.id}
                          className="bg-gray-100 px-3 py-2 rounded"
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="relative w-full block"
                  >
                    <div className="w-full aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={
                          course.imageUrl ||
                          "/img/Prelims-Foundation-Course.webp"
                        }
                        alt={course.name}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                      <span className="absolute w-20 h-20 bg-red-500/40 rounded-full animate-ping"></span>

                      <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <PlayIcon className="text-white w-8 h-8" />
                      </div>
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  <div className="text-3xl font-bold text-[#040c33] mb-6">
                    ₹ {course.batchDiscountPrice}/{" "}
                    <del className="text-gray-400">₹ {course.batchPrice}/</del>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Book className="w-4 h-4 text-red-700" />
                      <span className="text-blue-950">
                        Subjects : {course.subjects?.length || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-red-700" />
                      <span className="text-blue-950">
                        Validity: As Per Course duration
                        {/* Validity:{" "} */}
                        {/* {course.startDate &&
                          new Date(course.startDate).toLocaleDateString()}{" "}
                        -{" "}
                        {course.endDate &&
                          new Date(course.endDate).toLocaleDateString()} */}
                      </span>
                    </div>

                    {/* <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-red-700" />
                      <span className="text-blue-950">Hindi</span>
                    </div> */}

                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-red-700" />
                      <span className="text-blue-950">
                        Classroom Programme & Live classes on Dikshant IAS App.
                      </span>
                    </div>

                    {/* <div className="flex items-center gap-3">
                      <Infinity className="w-4 h-4 text-red-700" />
                      <span className="text-blue-950">
                        Unlimited access forever
                      </span>
                    </div> */}
                  </div>

                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full border p-2 rounded mt-6"
                  />

                  <button
                    onClick={applyCoupon}
                    className="w-full bg-gray-800 text-white py-2 rounded"
                  >
                    Apply Coupon
                  </button>

                  <button
                    onClick={() => handleCreateUser()}
                    className="mt-5 w-full bg-red-500 text-white py-3 rounded-lg font-semibold mb-6 hover:bg-red-700 transition-colors"
                  >
                    Buy Now
                  </button>

                  {isRegisterModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        {/* Close Button */}
                        <button
                          onClick={() => setIsRegisterModalOpen(false)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                          ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-[#040c33]">
                          Create Account
                        </h2>

                        <div className="space-y-3">
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                          />

                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                          />

                          <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                          />

                          {/* <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded"
                          /> */}

                          <button
                            onClick={handleCreateUser}
                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700"
                          >
                            Register & Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
